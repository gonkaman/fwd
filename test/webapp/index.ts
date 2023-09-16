import { section, div, h2 } from "fwd-vitrail/builder"
import { attr, attrMap } from "fwd-vitrail/effect"


const loginPage = section(
    attr('className', "ftco-section"),
    div(
        attr('className','container'),
        div(
            attr('className','row justify-content-center'),
            div(
                attr('className','col-md-6 text-center mb-5'),
                h2(
                    attrMap({
                        className: 'heading-section',
                        textContent: "Login #08" 
                    })
                )
            )
        )
    )
)