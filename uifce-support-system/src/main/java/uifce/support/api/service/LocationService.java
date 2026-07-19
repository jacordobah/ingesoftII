package uifce.support.api.service;


import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uifce.support.api.infra.EntityValidator;
import uifce.support.api.model.location.*;
import uifce.support.api.model.location.buildingDTO.BuildingRecordDTO;
import uifce.support.api.model.location.buildingDTO.BuildingResponseDTO;
import uifce.support.api.model.location.buildingDTO.BuildingResponseDetailDTO;
import uifce.support.api.model.location.buildingDTO.BuildingUpdateDTO;
import uifce.support.api.model.location.officeDTO.OfficeRecordDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDetailDTO;
import uifce.support.api.model.location.officeDTO.OfficeUpdateDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {
    private final BuildingRepository buildingRepository;
    private final OfficeRepository officeRepository;
    private final EntityValidator entityValidator;

    @Autowired
    public LocationService(BuildingRepository building, OfficeRepository office, EntityValidator entityValidator) {
        this.buildingRepository = building;
        this.officeRepository = office;
        this.entityValidator = entityValidator;
    }


    @Transactional
    public BuildingResponseDetailDTO recordBuilding(BuildingRecordDTO buildingRecord) {
        Building building = buildingRepository.save(new Building(buildingRecord));
        return new BuildingResponseDetailDTO(building);
    }

    public OfficeResponseDetailDTO recordOffice(Long id, OfficeRecordDTO officeRecord) {
        Building building = entityValidator.findOrThrow(buildingRepository,id,"building");
        Office office = officeRepository.save(new Office(building, officeRecord));
        return new OfficeResponseDetailDTO(office);
    }
    public List<BuildingResponseDTO> findAllBuildings() {
        List<Building> buildings = buildingRepository.findByActiveTrue();
        return buildings.stream().map(BuildingResponseDTO::new).collect(Collectors.toList());
    }

    public List<OfficeResponseDTO> findAllOfficesByBuilding(Long id) {
        List<Office> offices = officeRepository.findByBuilding_IdAndActiveTrue(id);
        return offices.stream().map(OfficeResponseDTO::new).toList();
    }

    @Transactional
    public BuildingResponseDetailDTO updateBuilding(@Valid BuildingUpdateDTO buildingUpdate) {
        Building building = entityValidator.findOrThrow(buildingRepository, buildingUpdate.id(), "building");
        building.setName(buildingUpdate.name());
        building.setUpdateDate(LocalDateTime.now());
        buildingRepository.save(building);
        return new BuildingResponseDetailDTO(building);
    }

    @Transactional
    public OfficeResponseDetailDTO updateOffice(@Valid OfficeUpdateDTO officeUpdate) {
        Office office = entityValidator.findOrThrow(officeRepository, officeUpdate.id(), "office");
        office.update(officeUpdate);
        officeRepository.save(office);
        return new OfficeResponseDetailDTO(office);
    }

    public OfficeResponseDetailDTO getOffice(Long id) {
        Office office = entityValidator.findOrThrow(officeRepository, id, "office");
        return new OfficeResponseDetailDTO(office);
    }

    public BuildingResponseDetailDTO getBuilding(Long id) {
        Building building = entityValidator.findOrThrow(buildingRepository, id, "building");
        return new BuildingResponseDetailDTO(building);
    }

    @Transactional
    public void deleteBuilding(Long id) {
        Building building = entityValidator.findOrThrow(buildingRepository,id,"building");
        building.disableBuilding();
        buildingRepository.save(building);
    }

    @Transactional
    public void deleteOffice(Long id) {
        Office office = entityValidator.findOrThrow(officeRepository, id, "office");
        office.disableOffice();
        officeRepository.save(office);
    }

    @Transactional
    public OfficeResponseDetailDTO enableOffice(Long id) {
        Office office = entityValidator.findOrThrow(officeRepository, id, "office");
        office.enableOffice();
        officeRepository.save(office);
        return new OfficeResponseDetailDTO(office);
    }

}
