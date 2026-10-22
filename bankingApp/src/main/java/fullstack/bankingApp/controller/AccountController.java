package fullstack.bankingApp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    @GetMapping
    public List<AccountResponse> getAccounts(){
        return List.of(
                new AccountResponse(1l, "Checking", "4821", new BigDecimal("2485.60"), "USD"),
                new AccountResponse(2l, "Savings", "7316", new BigDecimal("8920.00"), "USD")
        );
    }

    public record AccountResponse(Long accountId, String accountType, String lastFourDigits, BigDecimal balance, String currency){}
}
