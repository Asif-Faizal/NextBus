import 'package:dartz/dartz.dart';
import 'package:next_bus_admin/core/error/exception_handler.dart';
import 'package:next_bus_admin/core/error/failures.dart';
import 'package:next_bus_admin/core/network/network_info.dart';
import 'package:next_bus_admin/features/login/data/login/login_model.dart';
import '../../domain/login/login_entity.dart';
import '../../domain/login/login_repo.dart';
import 'login_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final ExceptionHandler exceptionHandler;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required NetworkInfo networkInfo,
  }) : exceptionHandler = ExceptionHandler(networkInfo);

  @override
  Future<Either<Failure, LoginEntity>> login(LoginRequestModel request) async {
    return exceptionHandler.handleApiCall(() async {
      final response = await remoteDataSource.login(request);
      return response;
    });
  }
}