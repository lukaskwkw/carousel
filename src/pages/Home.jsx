import React from "react";
import Header from "../components/Header";
import { Routes } from "../routes";
import Link from "../components/Link";

const Home = () => (
  <>
    <Header>Home Page!</Header>
    <ul>
      {Routes.map(href => (
        <li key={href}>
          <Link href={href}>{href}</Link>
        </li>
      ))}
    </ul>
  </>
);

export default Home;
