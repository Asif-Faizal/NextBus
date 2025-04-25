import 'package:equatable/equatable.dart';

class LoginEntity extends Equatable {
  final String id;
  final String username;
  final String role;
  final String token;
  final String refreshToken;

  const LoginEntity({
    required this.id,
    required this.username,
    required this.role,
    required this.token,
    required this.refreshToken,
  });

  @override
  List<Object?> get props => [id, username, role, token, refreshToken];
}