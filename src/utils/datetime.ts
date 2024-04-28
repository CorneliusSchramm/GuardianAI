export function getCurrentTime() {
  var d = new Date();
  d = new Date(d.getTime() - 3000000);
  return (
    d.getFullYear().toString() +
    "-" +
    ((d.getMonth() + 1).toString().length == 2
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1).toString()) +
    "-" +
    (d.getDate().toString().length == 2
      ? d.getDate().toString()
      : "0" + d.getDate().toString()) +
    " " +
    (d.getHours().toString().length == 2
      ? d.getHours().toString()
      : "0" + d.getHours().toString()) +
    ":" +
    (((d.getMinutes() / 5) * 5).toString().length == 2
      ? ((d.getMinutes() / 5) * 5).toString()
      : "0" + ((d.getMinutes() / 5) * 5).toString()) +
    ":" +
    (((d.getSeconds() / 5) * 5).toString().length == 2
      ? ((d.getSeconds() / 5) * 5).toString()
      : "0" + ((d.getSeconds() / 5) * 5).toString())
  );
}
