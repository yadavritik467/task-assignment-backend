export var ROLES;
(function (ROLES) {
    ROLES["USER"] = "user";
    ROLES["ADMIN"] = "admin";
    ROLES["MANAGER"] = "manager";
})(ROLES || (ROLES = {}));
export var STATUS;
(function (STATUS) {
    STATUS["TODO"] = "todo";
    STATUS["INPROGRESS"] = "in-progress";
    STATUS["COMPLETED"] = "completed";
})(STATUS || (STATUS = {}));
export var PRIORITY;
(function (PRIORITY) {
    PRIORITY["LOW"] = "low";
    PRIORITY["MEDIUM"] = "medium";
    PRIORITY["HIGH"] = "high";
})(PRIORITY || (PRIORITY = {}));
export var SOCKETEVENT;
(function (SOCKETEVENT) {
    SOCKETEVENT["TASK_CREATED"] = "TASK_CREATED";
    SOCKETEVENT["TASK_UPDATED"] = "TASK_UPDATED";
})(SOCKETEVENT || (SOCKETEVENT = {}));
