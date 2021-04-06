import { Start } from "./start.js";
import { Task } from "./task.js";
import { Events } from "./event_system.js";
import { Navigation } from "./navigation.js";
import { DefaultRendering, Rendering } from "./rendering.js";
import {
  MainElement,
  NewSessionPart,
  NewPomodoroElement,
  DailyGoalElement,
  WebElement,
  Options,
} from "./web_element.js";
import { Progress } from "./progress.js";
import { BreakProgress } from "./break_progress.js";
import { Feedback } from "./feedback.js";
import { wait } from "./utils/wait.js";
import { Congratulations } from "./congratulations.js";
import { Scrolling } from "./scrolling.js";

const SessionProgress = {
  FIRST_STEP: false,
  SECOND_STEP: false,
  THIRD_STEP: false,
  FOURTH_STEP: false,
};

export class Goro {
  constructor(user, userStorage, eventSystem) {
    this.userStorage = userStorage;
    this.user = user;
    this.eventSystem = eventSystem;

    new Start(this.user, () =>
      this.eventSystem.dispatch(Events.START)
    ).listen();
    new Navigation(this.user).listen();
  }

  init() {
    this.refreshDailyGoal();
    this.renderSessionParts();
    new Scrolling(".pomodoro").do()
    this.listen();
  }

  refreshDailyGoal() {
    const dailyGoalElement = DailyGoalElement.get();
    let completedPomodoros = 0;
    const currentSession = this.user.currentSession();
    if (currentSession !== undefined) {
      completedPomodoros = currentSession.completedPomodoros().length;
    }
    const dailyGoal = this.user.settings.dailyGoal;

    if (dailyGoalElement.textContent.match(/.*\d/)) {
      dailyGoalElement.textContent = `${
        dailyGoalElement.textContent.split(":")[0]
      }: `;
    }
    dailyGoalElement.textContent += `${completedPomodoros}/${dailyGoal}`;
  }

  renderSessionParts() {
    new Rendering(MainElement, NewSessionPart).dom();
    const currentPomodoros = this.user.currentSession().pomodoros;
    if (currentPomodoros.every((pom) => pom.completed())) {
      this.userStorage.newPomodoro();
    }
    for (let i = 1; i - 1 < currentPomodoros.length; i++) {
      if (i > 1) {
        const currentProgress = ((i - 1) / this.user.settings.dailyGoal) * 100;
        if (currentProgress >= 25 && !SessionProgress.FIRST_STEP) {
          SessionProgress.FIRST_STEP = true;
          new Congratulations(currentProgress);
          new Rendering(MainElement, NewSessionPart).dom();
        } else if (currentProgress >= 50 && !SessionProgress.SECOND_STEP) {
          SessionProgress.SECOND_STEP = true;
          new Congratulations(currentProgress);
          new Rendering(MainElement, NewSessionPart).dom();
        } else if (currentProgress >= 75 && !SessionProgress.THIRD_STEP) {
          SessionProgress.THIRD_STEP = true;
          new Congratulations(currentProgress);
          new Rendering(MainElement, NewSessionPart).dom();
        } else if (currentProgress == 100 && !SessionProgress.FOURTH_STEP) {
          SessionProgress.FOURTH_STEP = true;
          new Congratulations(currentProgress);
          new Rendering(MainElement, NewSessionPart).dom();
        } else {
          new Rendering(
            new WebElement(".session--part"),
            NewPomodoroElement
          ).dom();
        }
      }
      const pomodoro = currentPomodoros[i - 1];

      const task = new Task(
        pomodoro,
        () => this.eventSystem.dispatch(Events.UPDATE_TASK),
        new WebElement(".task", Options.RESOLVE_DEFINED, i)
      );
      task.update();
      task.listen();
      const progress = new Progress(
        pomodoro,
        this.user.settings.duration,
        () => this.eventSystem.dispatch(Events.FINISH_POMODORO),
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
        const breakDuration = this.user.isSmallPause()
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
    this.newSessionPart();
  }

  newSessionPart() {
    new Rendering(MainElement, NewSessionPart).dom();
    console.log("new session part")
    new Scrolling(".session--part").do()
    this.userStorage.newPomodoro();
    this.onNewPomodoro();
  }

  newPomodoro() {
    new Rendering(new WebElement(".session--part"), NewPomodoroElement).dom();
    new Scrolling(".pomodoro").do()
    this.userStorage.newPomodoro();
    this.onNewPomodoro();
  }

  onNewPomodoro() {
    const currentPomodoro = this.user.currentPomodoro();
    new Task(currentPomodoro, () =>
      this.eventSystem.dispatch(Events.UPDATE_TASK)
    ).listen();
    new Progress(currentPomodoro, this.user.settings.duration, () =>
      this.eventSystem.dispatch(Events.FINISH_POMODORO)
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
      new Scrolling(".break").do()
      const breakDuration = this.user.isSmallPause()
        ? this.user.settings.smallPause
        : this.user.settings.pause;
      new BreakProgress(breakDuration, /*() =>
        this.eventSystem.dispatch(Events.FINISH_BREAK)
      */).start();
      this.eventSystem.dispatch(Events.FINISH_BREAK)
    });
  }

  async onFinishBreak() {
    this.eventSystem.listen(Events.FINISH_BREAK, async () => {
      DefaultRendering().show(new WebElement(".productive").get());
      new Scrolling(".productive").do()
      await wait();
      DefaultRendering().show(new WebElement(".continue").get());
      new Scrolling(".continue").do()
      await wait();

      const currentProgress = this.user.currentProgress();

      if (currentProgress >= 25 && !SessionProgress.FIRST_STEP) {
        SessionProgress.FIRST_STEP = true;
        new Congratulations(currentProgress);
        this.newSessionPart();
      } else if (currentProgress >= 50 && !SessionProgress.SECOND_STEP) {
        SessionProgress.SECOND_STEP = true;
        new Congratulations(currentProgress);
        this.newSessionPart();
      } else if (currentProgress >= 75 && !SessionProgress.THIRD_STEP) {
        SessionProgress.THIRD_STEP = true;
        new Congratulations(currentProgress);
        this.newSessionPart();
      } else if (currentProgress == 100 && !SessionProgress.FOURTH_STEP) {
        SessionProgress.FOURTH_STEP = true;
        new Congratulations(currentProgress);
        this.newSessionPart();
      } else {
        this.newPomodoro();
      }
    });
  }

  onGiveFeedback() {
    this.eventSystem.listen(Events.GIVE_FEEDBACK, () => {
      this.userStorage.store();
    });
  }

  onUpdateTask() {
    this.eventSystem.listen(Events.UPDATE_TASK, () => {
      this.userStorage.store();
    });
  }
}
