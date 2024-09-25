package eu.more2020.visual.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import eu.more2020.visual.domain.UserSession;

@Service
public class SessionService {

    private Map<String, UserSession> activeSessions = new ConcurrentHashMap<>();

    public UserSession createSession(String host, String port, String username, String password, String databaseName) {
        UserSession userSession = new UserSession(host, port, username, password,databaseName);
        userSession.setSessionId(UUID.randomUUID().toString());
        activeSessions.put(userSession.getSessionId(), userSession);
        return userSession;
    }

    public UserSession getSession(String sessionId) {
        return activeSessions.get(sessionId);
    }

    public void updateSession(UserSession userSession) {
        activeSessions.put(userSession.getSessionId(), userSession);
    }

    public void removeSession(String sessionId) {
        activeSessions.remove(sessionId);
    }

    public Map<String, UserSession> getActiveSessions() {
        return activeSessions;
    }

}