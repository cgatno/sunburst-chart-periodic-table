# Wijmo 5 Periodic Sunburst

This is a novel interactive representation of the Periodic Table of Elements using a sunburst chart instead of the 
traditional 2D linear depiction. The goal of this project is to create the chart using only the [Wijmo 5 Sunburst 
control](http://demos.wijmo.com/5/Angular/SunburstIntro/SunburstIntro/) and some JavaScript conveniences (like Browserify).

## Why?

Not only is this a great chance to show the power and convenience of some newer [Wijmo 5](http://wijmo.com/) controls, but 
it also generally demonstrates the usefulness of interactive web apps in the classroom setting.

For full disclosure, I am currently an employee at [GrapeCity](http://tools.grapecity.com/). That being said, I am 
_also_ a recently graduated **biochemistry major**. That's why I have two goals with this project:

1. **To make it easier for younger students to learn the periodic table.** Trust me, I know, there are _a lot_ of 
elements on the periodic table, and while the grouping is second nature to a seasoned chemist, it's not always 
intuitive to new students. I think that this representation makes things a bit easier, so I'm hoping that 
some educators will give it a try.
2. **To sell you on the usefulness of packaged web controls, especially Wijmo.** I hope that this demo will give you 
a good idea of how easy it is to display data quickly, coherently and uniquely using the chart controls available in 
Wijmo 5. It makes this process easy and fun, and I think it'd be a great project for educating (say) high school students 
about programming and science simultaneously.

If you have any questions or suggestions concerning my goals, let me know by emailing me or opening an issue! Without 
further ado, let's get to the guts of this project.

## The Data

All of the periodic table data was obtained from [Data Explorer](http://www.data-explorer.com/) in 
[XML format](http://www.data-explorer.com/content/data/periodic-table-of-elements-xml.zip). The data was sanitized, 
trimmed down, and converted to JSON for this project. See the commit history for details on that process.

## Prerequisites

You will need the following things properly installed on your computer.

* Wijmo 5: [Purchase](http://wijmo.com/purchase/)/[Download trial](http://wijmo.com/download/)
    * wijmo.min.js
    * wijmo.min.css
    * wijmo.chart.min.js
    * wijmo.chart.hierarchical.min.js
    * _wijmo.theme.modern.min.css (optional)_
* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Browserify](http://browserify.org/)
* [ESLint](http://eslint.org/)
* [UglifyJS 2](https://github.com/mishoo/UglifyJS2)
* [Apache2 HTTP server](http://httpd.apache.org/) (if you want to test locally)

## Installation

* `git clone https://github.com/cgatno/wijmo5_periodic_sunburst.git`
* `cd wijmo5_periodic_sunburst`
* `npm install`
* Copy required Wijmo 5 files to vendor/ (alternatively you can use the [Wijmo 5 CDN](http://wijmo.com/5/docs/static/references.html))
* `sudo mv /var/www/html /var/www/html.bak && sudo ln -s . /var/www/html` symlink the project root to 
the default Apache2 web document directory

## Running / Development

* `sudo service apache2 start`
* Visit your app at [http://localhost](http://localhost).

### Building

* `browserify app.js -o assets/js/bundle.js`
* `ugilfyjs assets/js/bundle.js -o assets/js/bundle.min.js`

### Deploying

Simply use FTP or SFTP to upload index.html and the assets folder to your web server. Alternatively, you can use this 
project with any deployment/CI toolchain of your choice as long as it supports Node.js and NPM.

## Contributing

As the introduction to this project implies, it's designed and meant to be used by everyone; the more the merrier! Whether 
you're an educator, a programmer, a scientist, or just an interested student, feel free to fork this project, hack on it, 
open pull requests, start new issues, etc. I'd really like to see this used by everyone who thinks it has some utility, 
so I'm always open to suggestions, bug reports, really anything! Also, since this is supposed to be an educational experience, 
all questions are also welcome. If you don't want to ask your question publicly, just [shoot me an email](mailto:christian.gaetano@grapecity.com) 
and I'll get back to you as soon as I can.

**Code guidelines:** if you're thinking about contributing code, be aware that I use [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript). 
I do diverge from these rules in some areas, and I'll be posting more comprehensive code guidelines soon. For now, all 
contributions should adhere to the Airbnb guide. Aside from that, code should be tested and bug-free so that we keep 
this working well for any teachers or students using it.

## Contributors

The original author of this project is Ankit Gupta, a GrapeCity employee who first generated this idea and implemented 
it in a WinForms application.

The author of this project, specifically the web implementation of the Periodic Sunburst Chart, is [Christian Gaetano](https://github.com/cgatno).

## License

This project is currently licensed under the MIT license (subject to change). GrapeCity reserves all rights and ownership 
of the Wijmo controls and of this project.

## Further Reading / Useful Links

* [Wijmo 5 Sunburst Class documentation](http://wijmo.com/5/docs/topic/wijmo.chart.hierarchical.Sunburst.Class.html)
* [Wijmo 5 general documentation](http://wijmo.com/5/docs/)
