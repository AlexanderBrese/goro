import { Start } from "../component/start.js";
import { Task } from "../component/task.js";
import { Events, DefaultEventSystem } from "../util/event_system.js";
import { DefaultRendering, Rendering } from "../util/rendering.js";
import {
  MainElement,
  NewSessionPart,
  NewPomodoroElement,
  DailyGoalElement,
  WebElement,
  Options,
} from "../util/web_element.js";
import { Progress } from "../component/progress.js";
import { BreakProgress } from "../component/break_progress.js";
import { Feedback } from "../component/feedback.js";
import { wait } from "../util/wait.js";
import { Congratulations } from "../component/congratulations.js";
import { Scrolling } from "../util/scrolling.js";
import { AutoCompletion } from "../util/autocompletion.js";
import {
  Sound,
  ButtonClickedSound,
  BreakFinishedSound,
} from "../util/sound.js";
import { Quote } from "../component/quote.js";
import { RandomQuote } from "../util/quotes.js";
import { Greeting } from "../component/greeting.js";

const SessionProgress = {
  FIRST_STEP: false,
  SECOND_STEP: false,
  THIRD_STEP: false,
  FOURTH_STEP: false,
};

export class Home {
  constructor(userStorage) {
    this.userStorage = userStorage;
    this.user = this.userStorage.user;
    this.eventSystem = DefaultEventSystem();
    this.autocompletion = new AutoCompletion(this.userStorage.tasks);

    new Start(
      this.user.hasOngoingSession(),
      () => this.eventSystem.dispatch(Events.START),
      ButtonClickedSound(this.user.settings.muted)
    ).listen();

    new Greeting().type();
  }

  async init() {
    this.refreshDailyGoal();
    this.renderSessionParts();
    this.listen();
    await this.scrollDown();
  }

  async scrollDown() {
    const footer = new WebElement("footer").get();
    let yPos = 0;
    for (let index = 1; index < 5; index++) {
      await wait(800 + index * 400);
      const y = footer.offsetTop - footer.scrollTop + footer.clientTop;
      if (yPos != y) {
        yPos = y;
        new Scrolling("footer").do();
      } else {
        break;
      }
    }
  }

  refreshDailyGoal() {
    let completedPomodoros = 0;
    const currentSession = this.user.currentSession();
    if (currentSession !== undefined) {
      completedPomodoros = currentSession.completedPomodoros().length;
    }
    const dailyGoal = this.user.settings.dailyGoal;

    if (DailyGoalElement.textContent.match(/.*\d/)) {
      DailyGoalElement.textContent = `${
        DailyGoalElement.textContent.split(":")[0]
      }: `;
    }
    DailyGoalElement.textContent += `${completedPomodoros}/${dailyGoal}`;
  }

  async renderSessionParts() {
    new Rendering(MainElement, NewSessionPart.get()).dom();

    const currentPomodoros = this.user.currentSession().pomodoros;
    if (currentPomodoros.every((pom) => pom.completed())) {
      this.userStorage.newPomodoro();
    }

    for (let i = 1; i - 1 < currentPomodoros.length; i++) {
      const pomodoro = currentPomodoros[i - 1];

      if (i > 1) {
        const currentProgress = ((i - 1) / this.user.settings.dailyGoal) * 100;
        const prePomodoro = currentPomodoros[i - 2]
        if (currentProgress >= 25 && !SessionProgress.FIRST_STEP) {
          SessionProgress.FIRST_STEP = true;
          await this.renderSessionPart(currentProgress, prePomodoro);
        } else if (currentProgress >= 50 && !SessionProgress.SECOND_STEP) {
          SessionProgress.SECOND_STEP = true;
          await this.renderSessionPart(currentProgress, prePomodoro);
        } else if (currentProgress >= 75 && !SessionProgress.THIRD_STEP) {
          SessionProgress.THIRD_STEP = true;
          await this.renderSessionPart(currentProgress, prePomodoro);
        } else if (currentProgress == 100 && !SessionProgress.FOURTH_STEP) {
          SessionProgress.FOURTH_STEP = true;
          await this.renderSessionPart(currentProgress, prePomodoro);
        } else {
          new Rendering(
            new WebElement(".session--part").get(),
            NewPomodoroElement.get()
          ).dom();
        }
      }

      const task = new Task(
        pomodoro,
        () => this.eventSystem.dispatch(Events.UPDATE_TASK),
        this.autocompletion,
        new WebElement(".task", Options.RESOLVE_DEFINED, i).get()
      );
      task.update();
      task.listen();
      const progress = new Progress(
        pomodoro,
        this.user.settings.duration,
        () => this.eventSystem.dispatch(Events.FINISH_POMODORO),
        new Sound(this.user.settings.sound, this.user.settings.muted),
        ButtonClickedSound(this.user.settings.muted),
        new WebElement(".progress--time", Options.RESOLVE_DEFINED, i),
        new WebElement(".progress--bar", Options.RESOLVE_DEFINED, i),
        new WebElement(".progress--resume", Options.RESOLVE_DEFINED, i),
        new WebElement(".progress--finish", Options.RESOLVE_DEFINED, i)
      );

      const fb = new Feedback(
        pomodoro,
        () => this.eventSystem.dispatch(Events.GIVE_FEEDBACK),
        new WebElement(".productive--btn", Options.RESOLVE_DEFINED, i)
      );
      fb.listen();
      fb.update();

      if (pomodoro.completed()) {
        DefaultRendering().show(
          new WebElement(".productive", Options.RESOLVE_DEFINED, i).get()
        );
        DefaultRendering().show(
          new WebElement(".continue", Options.RESOLVE_DEFINED, i).get()
        );
        const breakDuration =
          i % 2 !== 0
            ? this.user.settings.smallPause
            : this.user.settings.pause;

        new BreakProgress(
          breakDuration,
          null,
          new WebElement(".break--progress", Options.RESOLVE_DEFINED, i),
          new WebElement(".break--title", Options.RESOLVE_DEFINED, i)
        ).update();
        DefaultRendering().show(
          new WebElement(".break", Options.RESOLVE_DEFINED, i).get()
        );
        progress.update();
      } else {
        progress.listen();
      }
    }
  }

  async renderSessionPart(sessionProgress, pomodoro) {
    if(pomodoro.quote !== "") new Quote(pomodoro.quote);
    await new Congratulations(sessionProgress).show();
    new Rendering(MainElement, NewSessionPart.get()).dom();
  }

  async renderNewSessionPart(sessionProgress) {
    const quote = RandomQuote();
    this.user.currentPomodoro().quote = quote
    this.userStorage.newPomodoro();
    new Quote(quote);
    new Scrolling(".quote").do();
    await wait(500);
    new Congratulations(sessionProgress).show();
    new Scrolling(".congratulations").do();
    await wait(1000);

    this.newSessionPart();
  }

  listen() {
    this.onNewSession();
    this.onFinishPomodoro();
    this.onFinishBreak();
    this.onGiveFeedback();
    this.onUpdateTask();
  }

  start() {
    this.eventSystem.listen(Events.START, () => {
      this.listen();
      this.newSession();
    });
  }

  onNewSession() {
    this.eventSystem.listen(Events.NEW_SESSION, () => {
      this.newSession();
    });
  }

  newSession() {
    this.userStorage.newSession();
    this.userStorage.newPomodoro();
    this.newSessionPart();
  }

  newSessionPart() {
    new Rendering(MainElement, NewSessionPart.get()).dom();
    new Scrolling(".session--part").do();
    this.onNewPomodoro();
  }

  newPomodoro() {
    new Rendering(
      new WebElement(".session--part").get(),
      NewPomodoroElement.get()
    ).dom();
    new Scrolling(".pomodoro").do();
    this.userStorage.newPomodoro();
    this.onNewPomodoro();
  }

  onNewPomodoro() {
    const currentPomodoro = this.user.currentPomodoro();
    new Task(
      currentPomodoro,
      () => this.eventSystem.dispatch(Events.UPDATE_TASK),
      this.autocompletion
    ).listen();
    new Progress(
      currentPomodoro,
      this.user.settings.duration,
      () => this.eventSystem.dispatch(Events.FINISH_POMODORO),
      new Sound(this.user.settings.sound, this.user.settings.muted),
      ButtonClickedSound(this.user.settings.muted)
    ).listen();
    new Feedback(currentPomodoro, () =>
      this.eventSystem.dispatch(Events.GIVE_FEEDBACK)
    ).listen();
  }

  onFinishPomodoro() {
    this.eventSystem.listen(Events.FINISH_POMODORO, () => {
      this.userStorage.store();
      this.refreshDailyGoal();

      DefaultRendering().show(new WebElement(".break").get());
      new Scrolling(".break").do();
      const breakDuration = this.user.isSmallPause()
        ? this.user.settings.smallPause
        : this.user.settings.pause;

      new BreakProgress(breakDuration, () =>
        this.eventSystem.dispatch(Events.FINISH_BREAK)
      ).start();
      //this.eventSystem.dispatch(Events.FINISH_BREAK);
    });
  }

  async onFinishBreak() {
    this.eventSystem.listen(Events.FINISH_BREAK, async () => {
      BreakFinishedSound(this.user.settings.muted).play();

      DefaultRendering().show(new WebElement(".productive").get());
      new Scrolling(".productive").do();
      await wait();
      DefaultRendering().show(new WebElement(".continue").get());
      new Scrolling(".continue").do();
      await wait();

      const currentProgress = this.user.currentProgress();
      if (currentProgress >= 25 && !SessionProgress.FIRST_STEP) {
        SessionProgress.FIRST_STEP = true;
        await this.renderNewSessionPart(currentProgress);
      } else if (currentProgress >= 50 && !SessionProgress.SECOND_STEP) {
        SessionProgress.SECOND_STEP = true;
        await this.renderNewSessionPart(currentProgress);
      } else if (currentProgress >= 75 && !SessionProgress.THIRD_STEP) {
        SessionProgress.THIRD_STEP = true;
        await this.renderNewSessionPart(currentProgress);
      } else if (currentProgress == 100 && !SessionProgress.FOURTH_STEP) {
        SessionProgress.FOURTH_STEP = true;
        await this.renderNewSessionPart(currentProgress);
      } else {
        this.newPomodoro();
      }
    });
  }

  onGiveFeedback() {
    this.eventSystem.listen(Events.GIVE_FEEDBACK, () => {
      ButtonClickedSound(this.user.settings.muted).play();
      this.userStorage.store();
    });
  }

  onUpdateTask() {
    this.eventSystem.listen(Events.UPDATE_TASK, () => {
      this.userStorage.store();
    });
  }
}
