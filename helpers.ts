type ParseTypes = "full" | "time" | "date";
export function parseCreatedAt(num: number, type: ParseTypes = "full"): string {
  let ret = "";
  let strNum = num.toString();

  if (type !== "date") {
    ret +=
      parseInt(strNum.slice(8, 10)) > 12
        ? (parseInt(strNum.slice(8, 10)) - 12).toString()
        : parseInt(strNum.slice(8, 10)).toString();
    ret += ":" + strNum.slice(10, 12);
    ret += parseInt(strNum.slice(8, 10)) > 12 ? "pm" : "am";
  }
  if (type === "time") return ret;
  if (type === "full") ret += ", ";
  ret +=
    strNum.slice(4, 6) + "/" + strNum.slice(6, 8) + "/" + strNum.slice(0, 4);

  return ret;
}
