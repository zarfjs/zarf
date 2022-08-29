import * as React from 'react';

interface DocumentProps {
    styleTag?: string
}

const Document = (props: React.PropsWithChildren<DocumentProps>) => {
    return <html>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
                {props.styleTag}
            </style>
        </head>
        <body id="body" className='no-js'>
            {props.children}
            <script>
                document.body.classList.remove("no-js");
                document.body.classList.add("js");
            </script>
        </body>
    </html>
}

export default Document
