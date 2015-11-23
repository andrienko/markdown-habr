var mdhabr = new require("markdown-habr")({
  remove_yo: true
});

var string = `
Добро пожаловать!
===
This is an example of markdown text
-- x -- Read
`;

console.log(mdhabr.parse(string));
