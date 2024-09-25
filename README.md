## Building module
You will need Java 11 to build the module.

Navigate to the [Min Max Cache Repository]([https://github.com/athenarc/MinMaxCache/tree/main]) clone and install the java package:

```
./mvn clean install
```

Then clone this repository.
```
git clone https://github.com/athenarc/ts-visual.git

```
Before installing you will need to configure it.
Download the [workspace folder]([https://imisathena-my.sharepoint.com/:f:/g/personal/bstam_athenarc_gr/El0u9Yk5XRRDnnRJkvK-OfMBNNv5yGefoEQVFy0cBylCoA?e=oMtgFz]) and place it somewhere in your computer.

Then move into src/main/resources/config/application.yml, and change the "/opt/more-workspace" path to the absolute path of the folder in your computer.

Afterwards, install the VA module.
```
./mv ts-visual
mvn clean install
```

To start the application, run the single executable JAR file that starts an embedded Apache Tomcat:

```
java -jar target/morevis-0.0.1-SNAPSHOT.jar
```

Then navigate to [http://localhost:8090](http://localhost:8090) in your browser.

</br>
