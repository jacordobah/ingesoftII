package uifce.support.api.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uifce.support.api.model.location.buildingDTO.BuildingRecordDTO;
import uifce.support.api.model.location.buildingDTO.BuildingResponseDTO;
import uifce.support.api.model.location.buildingDTO.BuildingResponseDetailDTO;
import uifce.support.api.model.location.buildingDTO.BuildingUpdateDTO;
import uifce.support.api.model.location.officeDTO.OfficeRecordDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDetailDTO;
import uifce.support.api.model.location.officeDTO.OfficeUpdateDTO;
import uifce.support.api.service.LocationService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/edificios")
public class LocationController {
    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<BuildingResponseDetailDTO> recordBuilding(@RequestBody @Valid BuildingRecordDTO buildingRecord,
                                                                    UriComponentsBuilder uriBuilder) {
        BuildingResponseDetailDTO buildingResponseDetailDTO = locationService.recordBuilding(buildingRecord);
        URI url = uriBuilder.path("/api/v1/edificios/{id}").buildAndExpand(buildingResponseDetailDTO.id()).toUri();
        return ResponseEntity.created(url).body(buildingResponseDetailDTO);
    }

    @GetMapping
    public ResponseEntity<List<BuildingResponseDTO>> findAllBuildings() {
        return ResponseEntity.ok(locationService.findAllBuildings());
    }

    @PostMapping("/{id}/oficinas")
    public ResponseEntity<OfficeResponseDetailDTO> recordOffice(@PathVariable Long id,
                                                                @RequestBody @Valid OfficeRecordDTO officeRecord,
                                                                UriComponentsBuilder uriBuilder){
        OfficeResponseDetailDTO officeDetail = locationService.recordOffice(id,officeRecord);
        URI url = uriBuilder.path("/api/v1/edificios/oficinas/{id}").buildAndExpand(officeDetail.id()).toUri();
        return ResponseEntity.created(url).body(officeDetail);
    }

    @GetMapping("/{id}/oficinas")
    public ResponseEntity<List<OfficeResponseDTO>> findAllOffice(@PathVariable Long id){
        return ResponseEntity.ok(locationService.findAllOfficesByBuilding(id));
    }

    @PutMapping
    public ResponseEntity<BuildingResponseDetailDTO> updateBuilding(@RequestBody @Valid BuildingUpdateDTO officeUpdate){
        return ResponseEntity.ok(locationService.updateBuilding(officeUpdate));
    }

    @PutMapping("/oficinas")
    public ResponseEntity<OfficeResponseDetailDTO> updateOffice(@RequestBody @Valid OfficeUpdateDTO officeUpdate){
        return ResponseEntity.ok(locationService.updateOffice(officeUpdate));
    }

    @GetMapping("/oficinas/{id}")
    public ResponseEntity<OfficeResponseDetailDTO> getOffice(@PathVariable Long id){
        return ResponseEntity.ok(locationService.getOffice(id));
    }

    @GetMapping("{id}")
    public ResponseEntity<BuildingResponseDetailDTO> getBuilding(@PathVariable Long id){
        return ResponseEntity.ok(locationService.getBuilding(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteBuilding(@PathVariable Long id){
        locationService.deleteBuilding(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/oficinas/{id}")
    public ResponseEntity deleteOffice(@PathVariable Long id){
        locationService.deleteOffice(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/oficinas/{id}")
    public ResponseEntity<OfficeResponseDetailDTO> enableOffice(@PathVariable Long id){
        return ResponseEntity.ok(locationService.enableOffice(id));
    }


}
