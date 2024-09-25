package eu.more2020.visual.service;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eu.more2020.visual.domain.UserSession;
import gr.imsi.athenarc.visual.middleware.domain.DatabaseConnection;

@Service
public class DatabaseConnectionService {

    @Autowired
    private SessionService sessionService;

    public void connectToDatabase(UserSession userSession, DatabaseConnection databaseConnection) throws SQLException {
        // Store the connection details in the user's session
        userSession.setDatabaseConnection(databaseConnection);
        // Update the user session in the session service
        sessionService.updateSession(userSession);

        // Establish the database connection using the provided details
        databaseConnection.connect();
    }
}