import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/usecases/approve_delete.dart';

part 'approve_delete_event.dart';
part 'approve_delete_state.dart';

class ApproveDeleteBloc extends Bloc<ApproveDeleteEvent, ApproveDeleteState> {
  final ApproveDeleteUsecase approveDeleteUsecase;
  ApproveDeleteBloc({required this.approveDeleteUsecase}) : super(ApproveDeleteInitial()) {
    on<ApproveDelete>(_onApproveDelete);
  }

  void _onApproveDelete(ApproveDelete event, Emitter<ApproveDeleteState> emit) async {
    emit(ApproveDeleteLoading());
    final result = await approveDeleteUsecase(event.id);
    result.fold(
      (failure) => emit(ApproveDeleteFailure(message: failure.toString())),
      (success) => emit(ApproveDeleteSuccess(message: success)),
    );
  }
}
