
# origin-lounge
An interactive intranet for origin students, alumni and employees

## Core Functionality
* secured login
* role-based views
* Socket.io based chat client and server
* GitHub integration (in progress)
* Angular UI Calendar integration (in progress. See this link: http://angular-ui.github.io/ui-calendar/)
* LinkedIn sign-in, integration (in progress)
* Custom content management (via a mark down editor)

## Tech Stack
* ASP.NET WebApi2
* SQL Server
* node.js
* express.js
* mongodb
* mongoose
* AngularJS

## Roles

### Student
* Current
* Alumni

### Employee
* Enrollment
* Instructor
* Placement
* Campus Manager
* Admissions

## Getting Started
1. Clone repo, then switch to dev-branch
2. Run npm install, followed by bower install
3. Make sure the app task within gulpfile.js is configured as follows:
  * for PC:
    
    ~~~
    gulp.task('app', function(){
    var options = {
        uri: 'http://localhost:8080',
        app: 'chrome'
    };
    gulp.src('./index.html')
        .pipe(open(options));
    });
    ~~~

  * for Mac:
    
    ~~~
    gulp.task('app', function(){
    var options = {
        uri: 'http://localhost:8080',
        app: 'Google Chrome'
    };
    gulp.src('./index.html')
        .pipe(open(options));
    });
    ~~~
4. Spin up the express API server by typing "nodemon server.js" in the webroot of origin-lounge
5. Spin up the chat server by typing "nodemon index.js" in the webroot of origin-lounge
6. Spin up the angular app by typing "gulp serve"
7. At the moment there are some dummy accounts you can use to login with. Please check with Sean Cahill to get this information.
