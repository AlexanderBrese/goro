class UsedQuote {
  constructor(text, used = false) {
    this.text = text;
    this.used = used;
  }
}

const Quotes = [
  new UsedQuote(
    "Trust yourself. Create the kind of self that you will be happy to live with all your life."
  ),
  new UsedQuote(
    "It’s not what you are that counts, it’s what they think you are."
  ),
  new UsedQuote(
    "You'll never decide what you want until you've decided who you are."
  ),
  new UsedQuote("Hard work conquers all."),
  new UsedQuote(
    "If A is success in life, then A = x + y + z. Work is x, play is y and z is keeping your mouth shut."
  ),
  new UsedQuote(
    "There's an old saying, 'Life begins at forty.' That's silly. Life begins every morning you wake up."
  ),
  new UsedQuote("Create a life you can’t wait to live."),
];

export function RandomQuote() {
  for (let quote of Quotes) {
    if (!quote.used) {
      quote.used = true;
      return quote.text;
    }
  }
  return "";
}
