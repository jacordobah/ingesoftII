package uifce.support.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import uifce.support.api.model.location.Building;
import uifce.support.api.model.location.BuildingRepository;

import java.time.LocalDateTime;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);

	}
}
