// components/Layout.js
import React, { Component } from 'react';
import Head from 'next/head'

export default class Layout extends Component {
    render () {
        const { children } = this.props
        return (
            <div>
                <Head>
                    <title>Writer Portal | Draft.dev</title>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Assistant&family=Roboto&display=swap" rel="stylesheet" />
                </Head>
                {children}
            </div>
        );
    }
}
