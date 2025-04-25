import 'failures.dart';

abstract class AppException implements Exception {
  final String message;
  final String? code;
  final StackTrace? stackTrace;

  const AppException({
    required this.message,
    this.code,
    this.stackTrace,
  });

  Failure toFailure();
}

class ServerException extends AppException {
  const ServerException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => ServerFailure(
        message: message,
        code: code,
      );
}

class CacheException extends AppException {
  const CacheException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => CacheFailure(
        message: message,
        code: code,
      );
}

class NetworkException extends AppException {
  const NetworkException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => NetworkFailure(
        message: message,
        code: code,
      );
}

class ValidationException extends AppException {
  const ValidationException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => ValidationFailure(
        message: message,
        code: code,
      );
}

class AuthenticationException extends AppException {
  const AuthenticationException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => AuthenticationFailure(
        message: message,
        code: code,
      );
}

class AuthorizationException extends AppException {
  const AuthorizationException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => AuthorizationFailure(
        message: message,
        code: code,
      );
}

class UnknownException extends AppException {
  const UnknownException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  @override
  Failure toFailure() => UnknownFailure(
        message: message,
        code: code,
      );
} 