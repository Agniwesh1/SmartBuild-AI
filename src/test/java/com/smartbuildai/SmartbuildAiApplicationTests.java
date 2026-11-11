package com.smartbuildai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "app.jwt.secret=SmartBuildTestSecretKeyAtLeast32CharactersLong")
class SmartbuildAiApplicationTests {

	@Test
	void contextLoads() {
	}

}
