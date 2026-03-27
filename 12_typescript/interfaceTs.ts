type ChaiOrder = {
  type: string;
  sugar: number;
  strong: boolean;
};

function makeChai(order: ChaiOrder) {
  console.log(order);
}
function serveChai(order: ChaiOrder) {
  console.log(order);
}

type TeaRecipe = {
  water: number;
  milk: number;
};

class MasalaChai implements TeaRecipe {
  water = 100;
  milk = 50;
}

// type CupSize = "small" | "large"; // class can only implement an object type
interface CupSize {
  size: "small" | "large";
}
// we prefer interface more in class implements
class Chai implements CupSize {
  size: "small" | "large" = "large";
}

// literal type
type TeaType = "chamomile" | "lemon" | "ginger";
function TeaOrder(tea: TeaType) {
  console.log(tea);
}

type BaseChai = { teaLeaves: number };
type Extra = { masala: number };
type MasalaChai2 = BaseChai & Extra; // includes properties of both type
const chai: MasalaChai2 = {
  teaLeaves: 10,
  masala: 2,
};

type UserProfile = {
  name: string;
  bio?: string; // bio is optional
};
const user1: UserProfile = { name: "mahi kushwah" };
const user2: UserProfile = {
  name: "jayant kushwah",
  bio: "i am a software engineer who is earning ten lakh inr every month",
};

type Config = {
  readonly appName: string;
  version: number;
};
const cfg: Config = {
  appName: "jk",
  version: 1,
};
// cfg.appName = "mk" ; //Cannot assign to 'appName' because it is a read-only property
