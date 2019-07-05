import React from "react";
import styled from "styled-components";

import Header from "../components/Header";
import Link from "../components/Link";

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ImageContainer = styled.div`
  max-width: 248px;
  width: 100%;
  height: 100px;
  flex: 1 0 21%;
  background-image: url("https://lorempixel.com/240/100/");
`;

const TestPug = () => pug`
  Images
    each image in Array(5).fill()
      ImageContainer(key=image)
`;

const Portfolio = () => (
  <>
    <Header>Portfolio section</Header>
    <TestPug />
    <Link href="/">Main Page</Link>
  </>
);

export default Portfolio;
