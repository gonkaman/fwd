const view0 = article(className("wrapper-2017"),
	figure(
		img(attr("src","/assets/img/css-login-forms/2021-finance-mobile-application-ux-ui-design-screen-one.png"), attr("alt","Demo image: Finance Mobile Application-UX/UI Design Screen One"), titleAttr("Finance Mobile Application-UX/UI Design Screen One"))
	),
	div(className("info-box"),
		div(className("info info-author"),
			h4(
				text('Author')
			),
			ul(
				li(
					text('Sowjanya')
				),
				li(
					time(
						text('October 28, 2021')
					)
				)
			)
		),
		div(className("info info-link"),
			h4(
				text('Links')
			),
			ul(
				li(
					a(attr("href","https://codepen.io/sowg/pen/dyzRPrO"), attr("target","_blank"),
						text('demo and code')
					)
				),
				li(
					a(attr("href","https://dribbble.com/shots/14210557-Finance-Mobile-Application-UX-UI-Design"), attr("target","_blank"),
						text('dribbble')
					)
				),
				li(
					a(attr("href","/assets/zip/css-login-forms/finance-mobile-application-ux-ui-design-screen-one.zip"),
						text('download')
					)
				)
			)
		),
		div(className("info info-frontend"),
			h4(
				text('Made with')
			),
			ul(
				li(
					text('HTML (Pug) / CSS (SCSS)')
				)
			)
		)
	),
	h4(className("about-the-item"),
		text('About a code')
	),
	h3(
		text('Finance Mobile Application-UX/UI Design Screen One')
	),
	p(),
	p(
		span(className("accent"),
			text('Compatible browsers: ')
		),
		text('Chrome, Edge, Firefox, Opera, Safari')
	),
	p(
		span(className("accent"),
			text('Responsive: ')
		),
		text('no')
	),
	p(
		span(className("accent"),
			text('Dependencies: ')
		),
		text('ionicons.js')
	)
)