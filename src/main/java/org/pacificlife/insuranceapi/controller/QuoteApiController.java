package org.pacificlife.insuranceapi.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class QuoteApiController {

    private final ChatClient chatClient;

    public QuoteApiController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/quote")
    public Map<String, Object> quote(@RequestBody QuoteRequest request) {

        int age = request.age();
        int coverage = request.coverage();
        boolean smoker = request.smoker();
        boolean diabetes = request.diabetes();

        try {
            String prompt = """
                You are a life insurance pricing estimator.
                Return only a monthly premium number in USD, no explanation and no dollar sign.

                Age: %d
                Coverage: %d
                Smoker: %s
                Diabetes: %s
                """.formatted(age, coverage, smoker, diabetes);

            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return Map.of(
                    "age", age,
                    "coverage", coverage,
                    "smoker", smoker,
                    "diabetes", diabetes,
                    "price", response.trim(),
                    "message", "OpenAI estimate generated successfully.",
                    "source", "OpenAI API via Spring Boot"
            );

        } catch (Exception e) {
            double base = switch (coverage) {
                case 100000 -> 22;
                case 250000 -> 38;
                case 500000 -> 61;
                case 1000000 -> 110;
                default -> 50;
            };

            if (age >= 40) base += 25;
            if (age >= 50) base += 35;
            if (smoker) base += 90;
            if (diabetes) base += 40;

            return Map.of(
                    "age", age,
                    "coverage", coverage,
                    "smoker", smoker,
                    "diabetes", diabetes,
                    "price", String.format("%.2f", base),
                    "message", "Fallback Pacific Life AI estimate.",
                    "source", "Local fallback pricing logic"
            );
        }
    }

    public record QuoteRequest(
            int age,
            int coverage,
            boolean smoker,
            boolean diabetes
    ) {
    }
}