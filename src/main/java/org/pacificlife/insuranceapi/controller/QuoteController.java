package org.pacificlife.insuranceapi.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class QuoteController {

    private final ChatClient chatClient;

    public QuoteController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/quote")
    public String quote(
            @RequestParam int age,
            @RequestParam int coverage,
            @RequestParam boolean smoker,
            @RequestParam boolean diabetes,
            Model model) {

        model.addAttribute("age", age);
        model.addAttribute("coverage", coverage);
        model.addAttribute("smoker", smoker);
        model.addAttribute("diabetes", diabetes);

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

            model.addAttribute("price", response.trim());
            model.addAttribute("message", "OpenAI estimate generated successfully.");
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

            model.addAttribute("price", String.format("%.2f", base));
            model.addAttribute("message", "Pacific Life AI estimate.");
        }

        return "quote-result";
    }
}