package buy_book.repository;

import buy_book.constant.RequestStatus;
import buy_book.entity.ProfileUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileUpdateRequestRepository extends JpaRepository<ProfileUpdateRequest, Long> {

    List<ProfileUpdateRequest> findAllByOrderByCreatedAtDesc();

    List<ProfileUpdateRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    Optional<ProfileUpdateRequest> findBySellerIdAndStatus(Long sellerId, RequestStatus status);

    Optional<ProfileUpdateRequest> findTopBySellerIdOrderByCreatedAtDesc(Long sellerId);
}
