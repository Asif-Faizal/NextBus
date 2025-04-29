import 'package:dartz/dartz.dart';

import '../bus_entity.dart';
import '../bus_repo.dart';

class RejectApprovalUsecase {
  final BusRepository busRepository;

  RejectApprovalUsecase({required this.busRepository});

  Future<Either<Exception, BusEntity>> call(String id) async {
    return busRepository.rejectApproval(id);
  }
}
