package com.Authentication.BACKEND.Io;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProfileRequest {

    private String name;
    private String email;
    private String password;
}
