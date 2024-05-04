import { generate } from "../codegen";
import { baseParse } from "../parse";
import { transform } from "../transform";
//import { transformElement } from "../transforms/transformElement";
//import { transformExpression } from "../transforms/transformExpression";
//import { transformText } from "../transforms/transformText";

test("string", () => {
  const ast = baseParse("hi");
  transform(ast)
  const { code } = generate(ast);
  //快照(string)测试
  expect(code).toMatchSnapshot();
});
//test("interpolation module", () => {
//  const ast = baseParse("{{hello}}");
//  transform(ast, {
//    nodeTransforms: [transformExpression],
//  });
//
//  const { code } = generate(ast);
//  expect(code).toMatchSnapshot();
//});
//
//test("element and interpolation", () => {
//  const ast = baseParse("<div>hi,{{msg}}</div>");
//  transform(ast, {
//    nodeTransforms: [transformElement, transformText, transformExpression],
//  });
//
//  const { code } = generate(ast);
//  expect(code).toMatchSnapshot();
//});
