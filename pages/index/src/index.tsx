import * as React from "react";
import { render } from 'react-dom';

class IndexComponent extends React.Component<any, any>
{
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                HELLO WORLD FROM REACT!
            </div>
        );
    }
}

render(
    <IndexComponent />,
    document.getElementById('container')
);
