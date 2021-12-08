package be.imatex.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;
/**
 * Klasse voor de configuratie van Security
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    DataSource datasource;

    @Autowired
    private UserDetailsService userDetailsService;


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.
                formLogin()
                    .loginPage("/login")
                    .defaultSuccessUrl("/home.html",true)
                    .failureUrl("/login-error")
                    .and()
                .logout()
                    .invalidateHttpSession(true)
                    .logoutSuccessUrl("/login")
                    .permitAll()
                .and()
                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers("/bestelling").hasAnyAuthority("admin", "verkoper")
                .antMatchers("/bestellingNieuweKlant").hasAnyAuthority("admin", "verkoper")
                .antMatchers("/bestellingenOverzicht").hasAnyAuthority("admin", "verkoper")
                .antMatchers("/schermOverzicht").hasAnyAuthority("admin", "productiemedewerker")
                .antMatchers("/login*").permitAll()
                .antMatchers("/logout*").permitAll()
                .antMatchers("/css/**").permitAll()
                .antMatchers("/**").authenticated()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().accessDeniedPage("/noAccess");
        http.csrf().disable();
        http.headers().frameOptions().disable();
    }

    @Bean
    public static NoOpPasswordEncoder passwordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }
    }

