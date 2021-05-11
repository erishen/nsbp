import * as React from 'react'
import { App } from './App'
import './css/test.css'
import './css/test.less'
import './css/test2.sass'
import './css/test3.scss'
import { Container } from './styled/test'

export interface IMainProps
{
    app: App  // Reference to our App.ts class
}

export class Main extends React.Component<IMainProps, {}>
{
    constructor(props: IMainProps)
    {
        super(props)
    }

    public render(): JSX.Element
    {
        return (
            <Container>
                <p>Main app</p>
                <div className="testBox"></div>
                <div className="testBox1"></div>
                <div className="testBox2"></div>
                <div className="testBox3"></div>
            </Container>
        )
    }
}