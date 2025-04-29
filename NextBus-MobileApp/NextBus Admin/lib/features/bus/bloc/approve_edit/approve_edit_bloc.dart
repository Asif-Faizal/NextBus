import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/bus_response_model.dart';
import '../../domain/usecases/approve_edit.dart';

part 'approve_edit_event.dart';
part 'approve_edit_state.dart';

class ApproveEditBloc extends Bloc<ApproveEditEvent, ApproveEditState> {
  final ApproveEditUsecase approveEditUsecase;
  ApproveEditBloc({required this.approveEditUsecase}) : super(ApproveEditInitial()) {
    on<ApproveEdit>((event, emit) async {
      emit(ApproveEditLoading());
      final result = await approveEditUsecase.call(event.id);
      result.fold(
        (failure) => emit(ApproveEditFailure(message: failure.toString())),
        (success) => emit(ApproveEditSuccess(editRequest: success)),
      );
    });
  }
}
