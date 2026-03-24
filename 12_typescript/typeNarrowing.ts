function getChai(kind: string | number) {
  if (typeof kind == "string") {
    return `Making ${kind} chai.`;
  }
  return `Chai order ${kind}`;
}

function serveChai(msg?: string): string {
  if (msg) {
    return ` serving ${msg} chai`;
  }
  return `serving default chai`;
}

function orderChai(size: "small" | "medium" | "large" | number): string {
  if (size == "small") {
    return `make ${size} chai`;
  } else if (size == "medium" || size == "large") {
    return `make extra chai`;
  }
  return `chai order  #${size}`;
}

// type guard

class KulhadChai {
  serve() {
    return `Serving Kulhad Chai`;
  }
}
class CuttingChai {
  serve() {
    return `Serving Cutting Chai`;
  }
}

function server(chai: KulhadChai | CuttingChai) {
  if (chai instanceof KulhadChai) {
    return chai.serve();
  }
}

type ChaiOrder = {
  type: string,
  sugar: number
}

function isChaiOrder(obj: any): obj is ChaiOrder {
  return (
    typeof obj == "object" &&
    obj !== null &&
    typeof obj.type == "string" &&
    typeof obj.sugar == "number"
  )
}

function serverOrder(item: ChaiOrder | string): string {
  if (isChaiOrder(item)) {
    return `Serving ${item.type} chai with ${item.sugar} sugar`;
  }
  return `Serving custom chai ${item}`;
}

type MasalaChai = { type: "masala", spiceLevel: number };
type GingerChai = { type: "ginger", amount: number };
type ElaichiChai = { type: "elaichi", aroma: number };

type Chai = MasalaChai | GingerChai | ElaichiChai;

function MakeChai(order: Chai) {
  switch (order.type) {
    case "masala":
      return `Masala Chai`;
      break;

    case "elaichi":
      return `Elaichi Chai`;
      break;

    case "ginger":
      return `Ginger Chai`;
      break;
  }
}