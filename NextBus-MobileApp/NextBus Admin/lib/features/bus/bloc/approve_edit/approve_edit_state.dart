part of 'approve_edit_bloc.dart';

abstract class ApproveEditState extends Equatable {
  const ApproveEditState();

  @override
  List<Object?> get props => [];
}

class ApproveEditInitial extends ApproveEditState {}

class ApproveEditLoading extends ApproveEditState {}

class ApproveEditSuccess extends ApproveEditState {
  final BusModel editRequest;

  const ApproveEditSuccess({required this.editRequest});

  @override
  List<Object?> get props => [editRequest];
}

class ApproveEditFailure extends ApproveEditState {
  final String message;

  const ApproveEditFailure({required this.message});
}
