package buy_book.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards unknown routes to index.html so React Router handles navigation.
 * Only matches paths without a file extension (no dots), so static assets
 * like /assets/main.abc123.js are still served normally by Spring Boot.
 */
@Controller
public class SpaController {

    @GetMapping(value = {
            "/{path:[^\\.]*}",
            "/{path1:[^\\.]*}/{path2:[^\\.]*}",
            "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}",
            "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}/{path4:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
