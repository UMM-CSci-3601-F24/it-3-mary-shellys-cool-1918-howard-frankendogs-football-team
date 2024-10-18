[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/82Q09jAd)
# CSCI 3601 Iteration Template <!-- omit in toc -->

- [Development](#development)
  - [Common commands](#common-commands)
- [Deployment](#deployment)
- [Resources](#resources)
- [Changing the name](#changing-the-name)
- [Contributors](#contributors)

This is your starter code for Iteration 1.

There is quite a lot of example code in this production template that you don't
want or need down the road, but is included to help you get started.
As you work on your project, you should replace these pieces with
elements of your project and _remove whatever you don't need_ (e.g., markdown
files, JSON data files, or any remnants of the labs). We include, for example,
the `User` parts of the previous labs. These are almost certainly not relevant
to your project and should be removed once you've started.

:bangbang: Keeping things like the support for our `User` types will
artificially inflate your test coverage results, making it look like you have
much better coverage than you actually do. This is neither cool nor helpful,
so you really should remove our code fairly early in your iteration.

:exclamation: You should remove this sentence and the text above, and
replace them with at least an elevator pitch description of your project so that
if someone comes to this repo they'll know what the project is about.

## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

### Common commands

From the `server` directory:

- `./gradlew run` to start the server
- `./gradlew test` to test the server
- `./gradlew checkstyleMain` to run Checkstyle on the server Java code in the `src/main` folder
- `./gradlew checkstyleTest` to run Checkstyle on the server Java code in the `src/test` folder
- `./gradlew check` will run the tests, run the Checkstyle checks, and generate coverage reports in one command

From the `client` directory:

- `ng serve` to run the client
- `ng test` to test the client
  - Or `ng test --no-watch --code-coverage` to run the client tests once and
    also compute the code coverage.
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:

- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## [Deployment](DEPLOYMENT.md)

Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Changing the name

The project by default has the name "CSCI 3601 Iteration Template". There are a few places you need to change to make this the name you want:

- The title in this README.md
- [`client/src/app/app.component.ts`](client/src/app/app.component.ts)
  - The `title` variable
  - Also the associated unit and E2E tests will need to be changed.
- [`client/src/app/app.component.html`](client/src/app/app.component.html)
  - The `mat-toolbar` element for the navigation drawer is just "Client" by default.
- [`client/src/index.html`](client/src/index.html)
  - The `title` element

You can go ahead and remove this section of the README once you have changed the name.

## Contributors

The contributors to this project can be seen [here](../../graphs/contributors).
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://floogulinc.com/"><img src="https://avatars.githubusercontent.com/u/1300395?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Paul Friederichsen</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Code">💻</a> <a href="#content-floogulinc" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Documentation">📖</a> <a href="#ideas-floogulinc" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-floogulinc" title="Mentoring">🧑‍🏫</a> <a href="#question-floogulinc" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3Afloogulinc" title="Reviewed Pull Requests">👀</a> <a href="#security-floogulinc" title="Security">🛡️</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Tests">⚠️</a> <a href="#a11y-floogulinc" title="Accessibility">️️️️♿️</a> <a href="#infra-floogulinc" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-floogulinc" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/helloworld12321"><img src="https://avatars.githubusercontent.com/u/56209343?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe Moonan Walbran</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/issues?q=author%3Ahelloworld12321" title="Bug reports">🐛</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Code">💻</a> <a href="#content-helloworld12321" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Documentation">📖</a> <a href="#ideas-helloworld12321" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-helloworld12321" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-helloworld12321" title="Maintenance">🚧</a> <a href="#mentoring-helloworld12321" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-helloworld12321" title="Project Management">📆</a> <a href="#question-helloworld12321" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3Ahelloworld12321" title="Reviewed Pull Requests">👀</a> <a href="#tool-helloworld12321" title="Tools">🔧</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kklamberty"><img src="https://avatars.githubusercontent.com/u/2751987?v=4?s=100" width="100px;" alt=""/><br /><sub><b>K.K. Lamberty</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Code">💻</a> <a href="#content-kklamberty" title="Content">🖋</a> <a href="#design-kklamberty" title="Design">🎨</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Documentation">📖</a> <a href="#ideas-kklamberty" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-kklamberty" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-kklamberty" title="Project Management">📆</a> <a href="#question-kklamberty" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Tests">⚠️</a> <a href="#tutorial-kklamberty" title="Tutorials">✅</a> <a href="#a11y-kklamberty" title="Accessibility">️️️️♿️</a></td>
    <td align="center"><a href="http://www.morris.umn.edu/~mcphee"><img src="https://avatars.githubusercontent.com/u/302297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nic McPhee</b></sub></a><br /><a href="#infra-NicMcPhee" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Tests">⚠️</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/issues?q=author%3ANicMcPhee" title="Bug reports">🐛</a> <a href="#content-NicMcPhee" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Documentation">📖</a> <a href="#design-NicMcPhee" title="Design">🎨</a> <a href="#maintenance-NicMcPhee" title="Maintenance">🚧</a> <a href="#projectManagement-NicMcPhee" title="Project Management">📆</a> <a href="#question-NicMcPhee" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3ANicMcPhee" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
