This Visual Analytics Module (VA) offers the functionality for MORE platform users to interact with the timeseries data and be informed on various KPIs
and complex events in real time. This module offers a dashboard like UI for the visualization and interaction with various types of data, such as hierarchical multidimensional timeseries.
In the MORE Visual Engine and Analytics module, the user is greeted with a map containing different RES. Moreover, the user is greeted with a variety of panels from where they can navigate the different RES farms, filter the visualized RES by their categorical features or view numerical statistics derived from the objects currently shown on the map.
These statistics are derived from the data stored in the in-memory database and are updated to correspond to the current state of visualization.
They can select an RES to visualize and analyze, its data is parsed and indexed on-the-fly, generating a
“crude” initial version of our index. The user, then, performs visual operations, which are translated to queries evaluated over the index.
Based on the user interaction, the index is adapted incrementally, adjusting its structure and updating statistics.

- Online Tool Demo: [[Link]](http://83.212.75.52:8090/)

<br/>
<br/>

## Building MORE VA module

Navigate to the [More visual cache](https://github.com/MORE-EU/more-vis-index) clone and install the java package:

```
./mvnw clean install
```

To build the MORE VA JAR file run:

```
./mvnw -Pprod clean verify
```

To start the application, run the single executable JAR file that starts an embedded Apache Tomcat:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8090](http://localhost:8090) in your browser.

</br>

## Configuration of MORE VA module

To configure the application, one must edit the included configuration file before they build and run the JAR. The configuration files are .yml files located in the src/main/resources/config folder of the application. There are three configuration files that the user should edit, depending on the environment they want to deploy the application. For development one should edit application-dev.yml, whilst for production the configuration file is application-prod.yml. Finally, application.yml is the default configuration file that is used if no information is available in the other two. To configure the application easily, one is advised to edit the latter file.

The fields that concern a user and must be edited before deployment are in the application field of the yml file and are described in detail below.

    modelardb:	Configurations for the location of the modelarDB server. This is used in the case where the data are stored in modelarDB.
    •	url:	URL of the modelarDB server.
    •	port:	Port in which the modelarDB server is running.
    workspacePath:	To be used in the case where the data are stored in CSV files. A folder in the user’s disk that will be used to store the  data and metadata of the CSV files of the different RES.

    timeFormat:	The format of the timestamp used by the datafiles. Default: yyyy-MM-dd HH:mm:ss
    delimiter:	Delimiter of the data files.
    toolAPI: Server in which the REST API for the event detection tools is running.

In the case where the RES data are stored in CSV datafiles. The user must place these files in the workspace directory they defined in the configuration file. This folder must contain the data files of each RES and a JSON file that contains metadata on the different RES and how to access their data. The RES data files can either be a single CSV or multiple CSV files inside a directory. The schema of the JSON file is described below:

    name:	Name of the farm
    type:	Type of the farm. If it is a wind turbine farm then the type is 1, while for a solar panel farm the type is 0.
    data:	An array of the metadata of each RES that belongs to this farm.
    The description of the fields of each object in each array is given below.

    	•	id:	A unique identifier of the RES (string)
    	•	name	The name of the CSV file or folder where the data of this RES reside (string)
    	•	formalName:	Formal name of the RES (string).
    	•	timeCol:	Time column of the data files (integer)
    	•	measures:	Columns to be accessed in the data file (integer[])

On initialization, the application, copies a directory that contains dummy data that belong to an RES farm.
These data are accessed through the map exploration mechanism, or directly via URL (e.g. http://localhost:8090/visualize/{folder_relative_path}, where {folder_relative_path} is the relative path of the data folder inside the workspace.
