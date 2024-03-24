import { JSDOM } from "jsdom";
import * as d3 from "d3";
import { Chess } from "chess.js";
import XMLSerializer from "xmlserializer";

const size = 360;

export class FenImgGenerator {
  chess: InstanceType<typeof Chess>;
  svg: any;

  constructor() {
    this.chess = new Chess();
    this.svg = null;
  }

  generate(fen: string) {
    this.chess.load(fen);
    const svg = this.draw();

    return svg;
  }

  draw() {
    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    let body = d3.select(dom.window.document.querySelector("body"));
    this.svg = body
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .attr("xmlns", "http://www.w3.org/2000/svg");
    this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", size)
      .attr("height", size)
      .style("fill", "rgba(255, 255, 255, 0.15)")
      .style("filter", "blur(20px)");
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        if ((i + j) % 2 === 1) {
          this.svg
            .append("rect")
            .attr("x", (size / 8) * (7 - j + 1) - size / 8)
            .attr("y", (size / 8) * i)
            .attr("width", size / 8)
            .attr("height", size / 8)
            .style("fill", "rgba(161, 165, 191)");
        }
      }
    }
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        const cols = "abcdefgh";
        // @ts-ignore
        const piece = this.chess.get(cols[i] + (8 - j));
        if (piece) {
          const pieceSvg = this.svg
            .append("svg")
            .attr("x", i * (size / 8))
            .attr("y", j * (size / 8))
            .attr("width", size / 8)
            .attr("height", size / 8);
          if (piece.color === "w") {
            switch (piece.type) {
              case "p":
                this.drawWhitePawn(pieceSvg, i, j);
                break;
              case "n":
                this.drawWhiteKnight(pieceSvg, i, j);
                break;
              case "b":
                this.drawWhiteBishop(pieceSvg, i, j);
                break;
              case "r":
                this.drawWhiteRook(pieceSvg, i, j);
                break;
              case "q":
                this.drawWhiteQueen(pieceSvg, i, j);
                break;
              case "k":
                this.drawWhiteKing(pieceSvg, i, j);
                break;
            }
          } else {
            switch (piece.type) {
              case "p":
                this.drawBlackPawn(pieceSvg, i, j);
                break;
              case "n":
                this.drawBlackKnight(pieceSvg, i, j);
                break;
              case "b":
                this.drawBlackBishop(pieceSvg, i, j);
                break;
              case "r":
                this.drawBlackRook(pieceSvg, i, j);
                break;
              case "q":
                this.drawBlackQueen(pieceSvg, i, j);
                break;
              case "k":
                this.drawBlackKing(pieceSvg, i, j);
                break;
            }
          }
        }
      }
    }

    const svgString = XMLSerializer.serializeToString(this.svg.node());
    const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
    return dataUrl;
  }

  drawBlackPawn(svg: any, i: number, j: number) {
    const g = svg.append("g");
    g.append("path")
      // change color to 34364C
      .attr(
        "d",
        "M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z",
        "fill",
        "#34364C"
      )
      .attr("fill", "#34364C")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", "0.33")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round");
  }

  drawBlackKnight(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr("d", "M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21")
      .attr("fill", "#34364C");
    g.append("path")
      .attr(
        "d",
        "M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
      )
      .attr("fill", "#34364C");
    g.append("path")
      .attr(
        "d",
        "M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"
      )
      .attr("fill", "#ececec")
      .attr("stroke", "#ececec");
    g.append("path")
      .attr(
        "d",
        "M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z"
      )
      .attr("fill", "#ececec")
      .attr("stroke", "none");
  }

  drawBlackBishop(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", "0.33")
      .attr("stroke-width", "0.75")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");

    const g1 = g
      .append("g")
      .attr("fill", "#34364C")
      .attr("stroke-linecap", "butt");
    g1.append("path").attr(
      "d",
      "M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"
    );
    g1.append("path").attr(
      "d",
      "M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
    );
    g1.append("path").attr("d", "M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z");
    g.append("path")
      .attr("d", "M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5")
      .attr("stroke", "#ececec")
      .attr("stroke-linejoin", "miter");
  }

  drawBlackRook(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill-rule", "evenodd")
      .attr("fill", "#34364C")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", "0.33")
      .attr("stroke-width", "1")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr(
        "d",
        "M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z"
      )
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr("d", "M14 29.5v-13h17v13H14z")
      .attr("stroke-linecap", "butt")
      .attr("stroke-linejoin", "miter");
    g.append("path")
      .attr("d", "M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z")
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr("d", "M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23")
      .attr("fill", "none")
      .attr("stroke", "#ececec")
      .attr("stroke-width", "0.5")
      .attr("stroke-linejoin", "miter");
  }

  drawBlackQueen(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", "0.33")
      .attr("stroke-width", "0.75")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "#34364C");
    const g1 = g.append("g").attr("stroke", "none");
    g1.append("circle").attr("cx", "6").attr("cy", "12").attr("r", "2.75");
    g1.append("circle").attr("cx", "14").attr("cy", "9").attr("r", "2.75");
    g1.append("circle").attr("cx", "22.5").attr("cy", "8").attr("r", "2.75");
    g1.append("circle").attr("cx", "31").attr("cy", "9").attr("r", "2.75");
    g1.append("circle").attr("cx", "39").attr("cy", "12").attr("r", "2.75");
    g.append("path")
      .attr(
        "d",
        "M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
      )
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr(
        "d",
        "M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
      )
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr("d", "M11 38.5a35 35 1 0 0 23 0")
      .attr("fill", "none")
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr(
        "d",
        "M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"
      )
      .attr("fill", "none")
      .attr("stroke", "#ececec");
  }

  drawBlackKing(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr("d", "M22.5 11.63V6")
      .attr("stroke-linejoin", "miter");
    g.append("path")
      .attr(
        "d",
        "M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
      )
      .attr("fill", "#34364C")
      .attr("stroke-linecap", "butt")
      .attr("stroke-linejoin", "miter");
    g.append("path")
      .attr(
        "d",
        "M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
      )
      .attr("fill", "#34364C");
    g.append("path").attr("d", "M20 8h5").attr("stroke-linejoin", "miter");
    g.append("path")
      .attr(
        "d",
        "M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9"
      )
      .attr("stroke", "#ececec");
    g.append("path")
      .attr(
        "d",
        "M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
      )
      .attr("stroke", "#ececec");
  }

  drawWhitePawn(svg: any, i: number, j: number) {
    const g = svg.append("g");
    g.append("path")
      .attr(
        "d",
        "M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      )
      .attr("fill", "#fff")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round");
  }

  drawWhiteKnight(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr("d", "M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21")
      .attr("fill", "#fff");
    g.append("path")
      .attr(
        "d",
        "M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
      )
      .attr("fill", "#fff");
    g.append("path")
      .attr(
        "d",
        "M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"
      )
      .attr("fill", "#34364C");
  }

  drawWhiteRook(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "#fff")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr("d", "M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5")
      .attr("stroke-linecap", "butt");
    g.append("path").attr("d", "M34 14l-3 3H14l-3-3");
    g.append("path")
      .attr("d", "M31 17v12.5H14V17")
      .attr("stroke-linecap", "butt")
      .attr("stroke-linejoin", "miter");
    g.append("path").attr("d", "M31 29.5l1.5 2.5h-20l1.5-2.5");
    g.append("path")
      .attr("d", "M11 14h23")
      .attr("fill", "none")
      .attr("stroke-linejoin", "miter");
  }

  drawWhiteBishop(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("x", 200)
      .attr("y", 200)
      .attr("width", 45)
      .attr("height", 45)
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");

    const g1 = g
      .append("g")
      .attr("fill", "#fff")
      .attr("stroke-linecap", "butt");
    g1.append("path").attr(
      "d",
      "M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"
    );
    g1.append("path").attr(
      "d",
      "M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
    );
    g1.append("path").attr("d", "M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z");
    g.append("path")
      .attr("d", "M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5")
      .attr("stroke-linejoin", "miter");
  }

  drawWhiteQueen(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "#fff")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path").attr(
      "d",
      "M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"
    );
    g.append("path")
      .attr(
        "d",
        "M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"
      )
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr(
        "d",
        "M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
      )
      .attr("stroke-linecap", "butt");
    g.append("path")
      .attr("d", "M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0")
      .attr("fill", "none");
  }

  drawWhiteKing(svg: any, i: number, j: number) {
    const g = svg
      .append("g")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#34364C")
      .attr("stroke-width", "1.5")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    g.append("path")
      .attr("d", "M22.5 11.63V6M20 8h5")
      .attr("stroke-linejoin", "miter");
    g.append("path")
      .attr(
        "d",
        "M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
      )
      .attr("fill", "#fff")
      .attr("stroke-linecap", "butt")
      .attr("stroke-linejoin", "miter");
    g.append("path")
      .attr(
        "d",
        "M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
      )
      .attr("fill", "#fff");
    g.append("path").attr(
      "d",
      "M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
    );
  }
}
