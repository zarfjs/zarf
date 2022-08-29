import * as React from 'react'

interface ContentProps {

}

const Content = (props: React.PropsWithChildren<ContentProps>) => (
    <div className="content">
        <section>
            <div className="container">{props.children}</div>
        </section>
    </div>
)

export default Content
