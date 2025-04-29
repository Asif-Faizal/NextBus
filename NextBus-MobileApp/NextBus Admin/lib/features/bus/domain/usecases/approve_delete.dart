import 'package:dartz/dartz.dart';

import '../bus_repo.dart';

class ApproveDeleteUsecase {
  final BusRepository busRepository;

  ApproveDeleteUsecase({required this.busRepository});

  Future<Either<Exception, String>> call(String id) async {
    return busRepository.approveDelete(id);
  }
}
