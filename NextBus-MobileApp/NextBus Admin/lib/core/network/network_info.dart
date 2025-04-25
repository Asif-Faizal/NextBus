import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dartz/dartz.dart';
import '../error/failures.dart';

abstract class NetworkInfo {
  Future<Either<Failure, bool>> isConnected();
}

class NetworkInfoImpl implements NetworkInfo {
  final Connectivity connectivity;

  NetworkInfoImpl(this.connectivity);

  @override
  Future<Either<Failure, bool>> isConnected() async {
    try {
      final result = await connectivity.checkConnectivity();
      if (result == ConnectivityResult.none) {
        return Left(NetworkFailure(
          message: 'No internet connection available',
          code: 'NO_INTERNET',
        ));
      }
      return const Right(true);
    } catch (e) {
      return Left(NetworkFailure(
        message: 'Failed to check internet connection: ${e.toString()}',
        code: 'CONNECTIVITY_CHECK_FAILED',
      ));
    }
  }
} 