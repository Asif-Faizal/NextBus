import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/bus_entity.dart';
import '../../domain/usecases/reject_approval.dart';

part 'reject_approval_event.dart';
part 'reject_approval_state.dart';

class RejectApprovalBloc
    extends Bloc<RejectApprovalEvent, RejectApprovalState> {
  final RejectApprovalUsecase rejectApprovalUsecase;

  RejectApprovalBloc({required this.rejectApprovalUsecase})
    : super(RejectApprovalInitial()) {
    on<RejectApproval>(_onRejectApproval);
  }

  void _onRejectApproval(
    RejectApproval event,
    Emitter<RejectApprovalState> emit,
  ) async {
    emit(RejectApprovalLoading());
    final result = await rejectApprovalUsecase(event.id);
    result.fold(
      (failure) => emit(RejectApprovalFailure(failure.toString())),
      (success) => emit(RejectApprovalSuccess(success)),
    );
  }
}
