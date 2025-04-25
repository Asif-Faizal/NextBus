import 'package:equatable/equatable.dart';

import '../../domain/login/login_entity.dart';

class LoginRequestModel extends Equatable {
  final String username;
  final String password;

  const LoginRequestModel({
    required this.username,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
        "username": username,
        "password": password,
      };

  @override
  List<Object?> get props => [username, password];
}

class LoginResponseModel extends LoginEntity {
  const LoginResponseModel({
    required super.id,
    required super.username,
    required super.role,
    required super.token,
    required super.refreshToken,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      id: json["_id"],
      username: json["username"],
      role: json["role"],
      token: json["token"],
      refreshToken: json["refreshToken"],
    );
  }
}