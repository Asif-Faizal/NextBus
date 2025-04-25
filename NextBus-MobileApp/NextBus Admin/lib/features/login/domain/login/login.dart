import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../data/login/login_model.dart';
import 'login_entity.dart';
import 'login_repo.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<Either<Failure, LoginEntity>> call(LoginRequestModel request) {
    return repository.login(request);
  }
}