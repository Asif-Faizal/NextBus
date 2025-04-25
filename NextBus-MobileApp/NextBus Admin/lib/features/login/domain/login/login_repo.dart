import 'package:dartz/dartz.dart';
import 'package:next_bus_admin/core/error/failures.dart';
import 'package:next_bus_admin/features/login/domain/login/login_entity.dart';

import '../../data/login/login_model.dart';

abstract class AuthRepository {
  Future<Either<Failure, LoginEntity>> login(LoginRequestModel request);
}