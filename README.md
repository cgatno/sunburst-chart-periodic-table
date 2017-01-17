# Wijmo 5 Periodic Sunburst

This is a novel interactive representation of the Periodic Table of Elements using a sunburst chart instead of the traditional 2D linear depiction. The goal of this project is to document the process of creating the chart using only the [Wijmo 5 Sunburst control](http://demos.wijmo.com/5/Angular/SunburstIntro/SunburstIntro/) and some JavaScript conveniences.

_[Skip right to installation](#prerequisites)_

## Why?

For full disclosure, I am currently an employee at [GrapeCity](http://tools.grapecity.com/). That being said, I am _also_ a recently graduated **biochemistry major**. That's why I have two goals with this project:

1. **To make it easier for younger students to learn the periodic table.** Trust me, I know, there are _a lot_ of elements on the periodic table (including [some new ones](https://iupac.org/iupac-announces-the-names-of-the-elements-113-115-117-and-118/)!), and while the grouping is second nature to a seasoned chemist, it's not always intuitive to new students. I think that this representation makes things a bit easier, so I'm hoping that some educators will give it a try.
2. **To sell you on the usefulness of web UI libraries, especially Wijmo.** I hope that this demo will give you a good idea of how easy it is to display data quickly, coherently and uniquely using the chart controls available in Wijmo 5. It makes this process easy and fun, and I think it'd be a great project for educating (say) high school students about programming and science simultaneously.

So while this is a great chance to show the power and convenience of some newer [Wijmo 5](http://wijmo.com/) controls, more importantly, it generally demonstrates the usefulness of interactive web apps in the classroom setting.

#### Looking for more?

You can also read more about this project and the data visualization background in the [official
companion blog post](http://wijmo.com/blog/rethinking-periodic-table-wijmo-sunburst/).

If you have any questions or suggestions concerning my goals, let me know by emailing me or opening an issue! Without further ado, let's get to the guts of this project.

## The Data

All of the periodic table data was obtained from [Data Explorer](http://www.data-explorer.com/) in
[XML format](http://www.data-explorer.com/content/data/periodic-table-of-elements-xml.zip). The data was sanitized, trimmed down, and converted to JSON for this project. See the commit history for details on that process.

## Prerequisites

You will need the following programs properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation

Clone the git repository:

    git clone https://github.com/cgatno/wijmo5_periodic_sunburst.git

Enter the source directory, install dependencies, and build:

    cd wijmo5_periodic_sunburst
    npm install
    gulp

## Running / Development

Everything you need to run and test the sample is built-in! Simply run

    npm start

and then visit [http://localhost:8100](http://localhost:8100) in your browser.

### Building

As indicated above, the toolchain for building is already included, too! Since the build system is configured with [Gulp.js](http://gulpjs.com/), in the source's root directory, just run

    gulp

and all of the source JavaScript will be bundled (via [Browserify](http://browserify.org/)), transpiled (via [Babel](https://babeljs.io/)) and minified (via [UglifyJS](http://lisperator.net/uglifyjs/)). Those are a lot of cool JavaScript tools working together, huh?

## Contributing

As the introduction to this project implies, it's designed and meant to be used by everyone; the more the merrier! Whether you're an educator, a programmer, a scientist, or just an interested student, feel free to fork this project, hack on it, open pull requests, start new issues, etc. I'd really like to see this used by everyone who thinks it has some utility, so I'm always open to suggestions, bug reports, really anything! Also, since this is supposed to be an educational experience, all questions are also welcome. If you don't want to ask your question publicly, just [shoot me an email](mailto:christian.gaetano@grapecity.com) and I'll get back to you as soon as I can.

If you want to do some work on the project or just need ideas (everyone needs some [inspiration](https://www.youtube.com/watch?v=ZXsQAXx_ao0) now and then), try checking out the [issue tracker](https://github.com/cgatno/wijmo5_periodic_sunburst/issues) for a list of current bugs and enhancement ideas.

#### Code style
For this project, I'm using [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications (see .eslintrc.json). The project is already set up for linting via ESLint, so be sure that any JavaScript modifications you make pass linting! If your code does not pass linting without modifying the current ESLint rules, let me know why you think they should be changed and we can discuss the possibility of modifying the rules.

#### Version Control Workflow

For this project I'll be using the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
which is derived from an original methodology used by Vincent Driessen.

All versioning follows the [Semantic Versioning](http://semver.org/) system of versioning.

## Contributors

Ankit Gupta, another GrapeCity employee, is the one who first came up with this idea and implemented it in a WinForms application.

The author of this project, specifically the web implementation of the Periodic Sunburst Chart, is [Christian Gaetano](https://github.com/cgatno).

## License

This project is currently licensed under the [MIT license](LICENSE). Please note that the MIT license does **not** cover any of the Wijmo library components or **anything** Wijmo-related for that matter. The Wijmo source code and the distributable libraries are protected under the terms of [GrapeCity Inc.'s EULA](http://www.componentone.com/img/PressCenter/EULA_GC_0715.pdf).

## Further Reading / Useful Links

* [Wijmo 5 Sunburst Class documentation](http://wijmo.com/5/docs/topic/wijmo.chart.hierarchical.Sunburst.Class.html)
* [Wijmo 5 general documentation](http://wijmo.com/5/docs/)
* [Plotting Hierarchical and Flat Data in a .NET Sunburst Chart](http://our.componentone.com/2016/10/27/plotting-hierarchical-and-flat-data-in-a-net-sunburst-chart/)
* [Rethinking the Periodic Table with Wijmo’s Sunburst](http://wijmo.com/blog/rethinking-periodic-table-wijmo-sunburst/)
* [Reducing “Code Weight” Using Wijmo](http://wijmo.com/blog/reducing-code-weight-wijmo/)
* [Official Sample on Wijmo Website](http://demos.wijmo.com/5/PureJS/PeriodicSunburst/PeriodicSunburst/)
