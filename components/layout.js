// components/Layout.js
import React, { Component } from "react";
import Head from "next/head";
import Script from "next/script";

export default class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <Head>
          <title>Writer Portal | Draft.dev</title>
        </Head>
        {children}
      </div>
    );
  }
}
