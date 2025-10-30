package com.planeja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PlanejaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanejaBackendApplication.class, args);
	}

}
