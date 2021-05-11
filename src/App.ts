import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { Main } from './Main'
import _ from 'lodash'

export class App
{
    constructor()
    {
        this.render()
    }

    private render(): void
    {
        const arr = [1, 2, 3, 4]

        _.each(arr, (item, index) => {
            console.log(item)
        })
        
        ReactDOM.render(React.createElement(Main, { app: this }), document.getElementById("root"))
    }
}

new App()
